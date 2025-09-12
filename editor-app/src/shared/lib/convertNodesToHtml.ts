import type { NodeId, SerializedNode } from '@craftjs/core'
import { Parser, type Tokens, marked } from 'marked'

import { inlineEmailTablesAndImages } from './tiptap/inline-email-tables-and-images'
// eslint-disable-next-line boundaries/element-types, boundaries/entry-point
import type { MjmlSectionProps } from '@/entities/EditorBlocks/MjmlSection'

type SocialItemLike = {
	id: string
	name?: string
	href?: string
	src: string
}

/** Экранируем значения атрибутов HTML */
const escapeAttr = (s: string): string =>
	String(s)
		.replace(/&/g, '&amp;')
		.replace(/"/g, '&quot;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')

/**
 * Поддержка Markdown-ссылок с кастомными атрибутами:
 * [текст](https://example.com){underline color="#ff0000"}
 */
function replaceStyledLinks(md: string): string {
	return md.replace(/\[([^\]]+)\]\(([^)\s]+)\)\{([^}]+)\}/g, (_m, text, url, attrs) => {
		let underline = false
		let color: string | undefined

		const attrPattern = /(\w+)="([^"]+)"|underline/g
		let match: RegExpExecArray | null

		while ((match = attrPattern.exec(attrs))) {
			if (match[0] === 'underline') underline = true
			if (match[1] === 'color') color = match[2]
		}

		const styleParts: string[] = []
		if (underline) styleParts.push('text-decoration: underline')
		if (color) styleParts.push(`color: ${color}`)
		const styleAttr = styleParts.length ? ` style="${styleParts.join('; ')}"` : ''

		return `<a href="${escapeAttr(url)}"${styleAttr} target="_blank" rel="noopener noreferrer">${text}</a>`
	})
}

export function ensureAnchorTargets(html: string): string {
	return html.replace(/<a\b([^>]*?)>/gi, (_full, attrs: string) => {
		let a = attrs as string

		// target
		if (/\btarget\s*=/.test(a)) {
			a = a.replace(/\btarget\s*=\s*(['"])(.*?)\1/i, 'target="_blank"')
		} else {
			a += ' target="_blank"'
		}

		// rel
		const relRe = /\brel\s*=\s*(['"])(.*?)\1/i
		const relMatch = relRe.exec(a)
		if (relMatch) {
			const set = new Set(relMatch[2].split(/\s+/).filter(Boolean))
			set.add('noopener')
			set.add('noreferrer')
			a = a.replace(relRe, (_m, q) => `rel=${q}${Array.from(set).join(' ')}${q}`)
		} else {
			a += ' rel="noopener noreferrer"'
		}

		return `<a${a}>`
	})
}

const renderer = new marked.Renderer()
const parser = new Parser()

renderer.link = ({ href, title, tokens }: Tokens.Link): string => {
	const innerHtml = tokens ? parser.parseInline(tokens) : ''
	const titleAttr = title ? ` title="${escapeAttr(title)}"` : ''
	const safeHref = href ?? ''
	return `<a href="${escapeAttr(safeHref)}"${titleAttr} target="_blank" rel="noopener noreferrer">${innerHtml}</a>`
}

marked.use({ renderer })

/** Конвертация Markdown -> HTML c учётом стилизованных ссылок */
export const markdownToHtml = (markdown: string): string => {
	const styledMd = replaceStyledLinks(markdown)
	return marked.parse(styledMd, { breaks: true }) as string
}

const convertNodeToHtml = (nodeId: NodeId, nodes: Record<NodeId, SerializedNode>): string => {
	const node = nodes[nodeId]
	if (!node) return ''

	const { type, props, nodes: childNodes, linkedNodes } = node
	const componentName = typeof type === 'string' ? type : type.resolvedName

	let childrenHtml = (childNodes || [])
		.map((childId: NodeId) => convertNodeToHtml(childId, nodes))
		.join('')

	if (linkedNodes) {
		childrenHtml += Object.values(linkedNodes)
			.map((nodeId: NodeId) => convertNodeToHtml(nodeId, nodes))
			.join('')
	}

	// const camelToKebab = (s: string) => s.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`)
	// const styleObjToString = (style: Record<string, string | number | undefined | null>) =>
	// 	Object.entries(style)
	// 		.filter(([, v]) => v !== undefined && v !== null && v !== '')
	// 		.map(([k, v]) => `${camelToKebab(k)}:${v}`)
	// 		.join('; ')

	const escapeAttr = (v: string) => String(v).replace(/"/g, '&quot;')

	const toNum = (v: unknown): number | null => {
		if (typeof v === 'number' && Number.isFinite(v)) return v
		if (typeof v === 'string') {
			const n = Number(v)
			return Number.isFinite(n) ? n : null
		}
		return null
	}

	const getNodeProp = <T = unknown>(
		node: SerializedNode | undefined,
		key: string
	): T | undefined => {
		const p = node?.props as unknown
		if (p && typeof p === 'object') {
			return (p as Record<string, unknown>)[key] as T | undefined
		}
		return undefined
	}

	const resolvedNameOf = (t: unknown): string | undefined => {
		if (typeof t === 'string') return t
		if (typeof t === 'object' && t !== null) {
			const rn = (t as { resolvedName?: unknown }).resolvedName
			return typeof rn === 'string' ? rn : undefined
		}
		return undefined
	}

	const findParentName = (
		childId: NodeId,
		ns: Record<NodeId, SerializedNode>
	): string | undefined => {
		for (const pid of Object.keys(ns) as NodeId[]) {
			const n = ns[pid]
			const kids = (n.nodes as NodeId[]) ?? []
			const linked = n.linkedNodes ? (Object.values(n.linkedNodes) as NodeId[]) : []
			if (kids.includes(childId) || linked.includes(childId)) {
				return resolvedNameOf(n.type)
			}
		}
		return undefined
	}

	switch (componentName) {
		case 'MjmlWrapper':
		case 'Container': {
			const background = props.background || '#fff'
			const borderRadius = props.borderRadius || 8
			const emailWidth = props.emailWidth || 600
			const padding = props.padding || { top: 0, right: 0, bottom: 0, left: 0 }
			const bgImage = props.bgImageUrl
			const hasBgImage = props.hasBgImage

			const bgCss =
				hasBgImage && bgImage
					? `background-image:url('${escapeAttr(bgImage)}');background-repeat:no-repeat;background-size:cover;background-position:center;`
					: ''

			return `
    <center>
      <!--[if mso]>
      <table role="presentation" align="center" border="0" cellspacing="0" cellpadding="0" width="${emailWidth}">
        <tr><td style="background:${background}; border-radius:${borderRadius}px;">
      <![endif]-->
      <div data-email-width="${emailWidth}"
           style="width:100%; max-width:${emailWidth}px; margin:0 auto; background:${background}; border-radius:${borderRadius}px; ${bgCss}">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
          <tr>
            <td style="padding:${padding.top ?? 0}px ${padding.right ?? 0}px ${padding.bottom ?? 0}px ${padding.left ?? 0}px; border-radius:${borderRadius}px;">
              ${childrenHtml}
            </td>
          </tr>
        </table>
      </div>
      <!--[if mso]></td></tr></table><![endif]-->
    </center>
  `
		}

		case 'MjmlSection': {
			type SectionHtmlProps = MjmlSectionProps & {
				backgroundImageUrl?: string
				bgImageUrl?: string
			}

			const {
				gap = 20,
				paddingTop = '20px',
				paddingRight = '20px',
				paddingBottom = '20px',
				paddingLeft = '20px',
				containersBackground = 'transparent',
				hasBgImage = false,
				bgImageUrl,
				bgSize = 'cover',
				bgRepeat = 'no-repeat',
				bgPosition = 'center'
			} = props as SectionHtmlProps

			const cols = childNodes || []
			const N = cols.length
			const raw: Array<number | null> = cols.map((cid: NodeId) => {
				const val = getNodeProp<number | string>(nodes[cid], 'widthPercent')
				const n = toNum(val)
				return n !== null && n > 0 ? n : null
			})

			const definedIdx = raw.map((v, i) => (v != null ? i : -1)).filter(i => i >= 0)
			const allAre100 = definedIdx.length === N && definedIdx.every(i => raw[i] === 100)
			const borderRadius = props.borderRadius ? `${props.borderRadius};` : ''

			const toPct = (v: number) => Math.max(0, Number(v.toFixed(3)))

			const pcts: number[] = new Array(N).fill(0)

			if (definedIdx.length === 0 || allAre100) {
				const each = 100 / Math.max(1, N)
				for (let i = 0; i < N; i++) pcts[i] = toPct(each)
			} else {
				const sumDef = definedIdx.reduce((s, i) => s + (raw[i] as number), 0)

				if (!Number.isFinite(sumDef) || sumDef <= 0) {
					const each = 100 / Math.max(1, N)
					for (let i = 0; i < N; i++) pcts[i] = toPct(each)
				} else {
					let used = 0
					for (const i of definedIdx) {
						const v = ((raw[i] as number) / sumDef) * 100
						pcts[i] = toPct(v)
						used += pcts[i]
					}
					const undefinedIdx = cols.map((_, i) => i).filter(i => !definedIdx.includes(i))
					const remain = Math.max(0, 100 - used)
					if (undefinedIdx.length > 0) {
						const eachU = remain / undefinedIdx.length
						for (const i of undefinedIdx) pcts[i] = toPct(eachU)
					}
				}
			}

			const half = Math.floor(Number(gap) / 2)

			const cells = cols
				.map((cid: NodeId, idx: number) => {
					const inner = convertNodeToHtml(cid, nodes)
					const isFirst = idx === 0
					const isLast = idx === N - 1
					const pl = isFirst ? 0 : half
					const pr = isLast ? 0 : half
					const pct = pcts[idx]

					return `
        <td width="${pct}%" valign="top" style="vertical-align:top; width:${pct}%;">
          <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
            <tr>
              <td style="padding-left:${pl}px; padding-right:${pr}px; vertical-align:top;">
                ${inner}
              </td>
            </tr>
          </table>
        </td>
      `
				})
				.join('')

			const wrapperStyleProps: React.CSSProperties = {
				background: containersBackground,
				overflow: 'hidden'
			}

			if (borderRadius) {
				wrapperStyleProps.borderRadius = borderRadius
			}

			if (hasBgImage && bgImageUrl) {
				wrapperStyleProps.backgroundImage = `url('${bgImageUrl}')`
				wrapperStyleProps.backgroundRepeat = bgRepeat
				wrapperStyleProps.backgroundSize = bgSize
				wrapperStyleProps.backgroundPosition = bgPosition
			}

			const wrapperStyle = (Object.keys(wrapperStyleProps) as Array<keyof typeof wrapperStyleProps>)
				.map(key => {
					const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
					return `${cssKey}:${wrapperStyleProps[key]};`
				})
				.join('')

			return `
				<div style="${wrapperStyle}">
					<table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
						<tr>
							<td style="padding:${paddingTop} ${paddingRight} ${paddingBottom} ${paddingLeft}; box-sizing:border-box;">
								<table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0"
											style="border-collapse:collapse; table-layout:fixed;">
									<tr>
										${cells}
									</tr>
								</table>
							</td>
						</tr>
					</table>
				</div>
			`
		}

		case 'MjmlColumn':
			return `<div style="flex-basis: ${props.width || '100%'}; padding: 10px; min-height: 50px;">
          ${childrenHtml}
        </div>`

		case 'MjmlImage': {
			const tdAlign =
				props.align === 'right' ? 'right' : props.align === 'center' ? 'center' : 'left'

			const paddingTop = props.paddingTop || '0px'
			const paddingRight = props.paddingRight || '0px'
			const paddingBottom = props.paddingBottom || '0px'
			const paddingLeft = props.paddingLeft || '0px'
			const width = props.width || 'auto'
			const heightStyle = props.height ? `height:${props.height};` : ''
			const radiusStyle = props.borderRadius ? `border-radius:${props.borderRadius};` : ''

			const imgStyles =
				`display:block; border:0; outline:none; text-decoration:none;` +
				`max-width:100%; ${heightStyle} ${radiusStyle}`

			const imgTag = `<img src="${props.src}" alt="${props.alt || ''}" style="${imgStyles}" ${width !== 'auto' ? `width="${String(width).replace(/px$/, '')}"` : ''} />`
			const content = props.href
				? `<a href="${props.href}" target="_blank" rel="noopener noreferrer" style="text-decoration:none;">${imgTag}</a>`
				: imgTag

			return `
							<table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
								<tr>
									<td align="${tdAlign}" style="padding:${paddingTop} ${paddingRight} ${paddingBottom} ${paddingLeft};">
										${content}
									</td>
								</tr>
							</table>
						`
		}

		case 'MjmlSpacer': {
			// const mode = props.mode || 'space'
			const thickness = props.thickness || '2px'
			const width = (props.width ?? 'auto') === 'auto' ? '100%' : props.width
			const color =
				typeof props.color === 'string' && props.color.trim() ? props.color.trim() : '#FFFFFF'
			const lineStyleVal = (props.lineStyle && props.lineStyle.value) || props.lineStyle || 'solid'
			const align = props.align || 'left'
			const background = props.background ?? '#FFFFFF'

			const paddingStyles = `padding-top:${props.paddingTop || '0px'};padding-right:${props.paddingRight || '0px'};padding-bottom:${props.paddingBottom || '0px'};padding-left:${props.paddingLeft || '0px'};`

			const wrapperOpen = `<div style="background:${background};${paddingStyles}text-align:${align};">`
			const wrapperClose = `</div>`

			// if (mode === 'space') {
			// 	const h = thickness && thickness !== 'auto' ? thickness : '0px'
			// 	return `${wrapperOpen}<div style="height:${h};"></div>${wrapperClose}`
			// }

			const line = `<div style="display:inline-block;width:${width};border-bottom:${thickness} ${lineStyleVal} ${color};"></div>`
			return `${wrapperOpen}${line}${wrapperClose}`
		}

		case 'MjmlSocialBlock': {
			const items = (props.items || []) as SocialItemLike[]
			const size = props.size || 32
			const gap = Math.max(0, props.gap ?? 10)

			const tdAlign =
				props.align === 'right' ? 'right' : props.align === 'center' ? 'center' : 'left'

			const pt = props.paddingTop || '0px'
			const pr = props.paddingRight || '0px'
			const pb = props.paddingBottom || '0px'
			const pl = props.paddingLeft || '0px'
			const background = props.background || 'transparent'

			const halfGap = Math.floor(gap / 2)

			const iconsHtml = items
				.map(it => {
					const href = it.href || '#'
					const alt = it.name || 'social'
					return `
        <a href="${escapeAttr(href)}"
           target="_blank" rel="noopener noreferrer"
           style="
             display:inline-block;
             width:${size}px;
             height:${size}px;
             margin:${halfGap}px ${halfGap}px;
             text-decoration:none;
             vertical-align:top;
           ">
          <img src="${escapeAttr(it.src)}"
               alt="${escapeAttr(alt)}"
               width="${size}" height="${size}"
               style="display:block; border:0; outline:none; text-decoration:none;" />
        </a>
      `
				})
				.join('')

			return `
    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background:${background};">
      <tr>
        <td align="${tdAlign}" style="padding:${pt} ${pr} ${pb} ${pl};">
          <div style="font-size:0; line-height:0; text-align:${tdAlign};">
            ${iconsHtml}
          </div>
        </td>
      </tr>
    </table>
  `
		}

		case 'MjmlHtml': {
			const rawHtmlContent = props.html || '<div>Текстовый редактор</div>'
			const htmlContent = inlineEmailTablesAndImages(ensureAnchorTargets(rawHtmlContent))

			const containerStyles = `
				margin-top:${props.marginTop || '0px'};
				margin-right:${props.marginRight || '0px'};
				margin-bottom:${props.marginBottom || '0px'};
				margin-left:${props.marginLeft || '0px'};
				padding:10px;
				box-sizing:border-box;
				overflow:visible;
				word-break:break-word;
				overflow-wrap:anywhere;
				white-space:normal;
			`.replace(/\s+/g, ' ')

			const tiptapStyles = `
				<style>
						.tiptap-display p { margin-bottom: 12px; }
						.tiptap-display h1, .tiptap-display h2, .tiptap-display h3 { margin-top: 16px; margin-bottom: 8px; font-weight: 600; }
						.tiptap-display h1 { font-size: 24px; }
						.tiptap-display h2 { font-size: 20px; }
						.tiptap-display h3 { font-size: 18px; }
						.tiptap-display ul, .tiptap-display ol { padding-left: 24px; margin-bottom: 12px; }
						.tiptap-display ul { list-style-type: disc; }
						.tiptap-display ol { list-style-type: decimal; }
						.tiptap-display a { color: #3b82f6; text-decoration: underline; }
						.tiptap-display img { max-width: 100%; height: auto; }
						.tiptap-display blockquote { border-left: 3px solid #e2e8f0; padding-left: 16px; margin-left: 0; color: #64748b; }
						.tiptap-display pre { background-color: #f1f5f9; padding: 12px; border-radius: 4px; overflow-x: auto; }
						.tiptap-display code { background-color: #f1f5f9; padding: 2px 4px; border-radius: 4px; }
						.tiptap-display ul[data-type="taskList"] { list-style: none; padding: 0; }
						.tiptap-display ul[data-type="taskList"] li { display: flex; align-items: flex-start; }
						.tiptap-display ul[data-type="taskList"] li > label { margin-right: 8px; margin-top: 4px; }
						.tiptap-display ul[data-type="taskList"] li > div { margin-top: 0; }

						.tiptap-display table {
							border-collapse: collapse;
							width: 100%;
							table-layout: auto;
						}
						.tiptap-display th,
						.tiptap-display td {
							border: 1px solid #d4d4d4;
							padding: 6px 8px;
							background: #fff;
						}
						.tiptap-display th {
							background: #f5f7fa;
							font-weight: 600;
							text-align: center;
							vertical-align: middle;
						}
						.tiptap-display td {
							text-align: left;
							vertical-align: middle;
						}
				</style>
			`

			return `${tiptapStyles}<div class="tiptap-display" style="${containerStyles}">
				${htmlContent}
			</div>`
		}

		case 'MjmlText': {
			const htmlContent = markdownToHtml(props.text || 'Введите текст...')

			const pt = props.paddingTop || '0px'
			const pr = props.paddingRight || '0px'
			const pb = props.paddingBottom || '0px'
			const pl = props.paddingLeft || '0px'
			const bg = props.backgroundColor || 'transparent'
			const radius = props.borderRadius || '0px'
			const align = props.textAlign || 'left'
			const textStyle = `
				font-size:${props.fontSize || '14px'};
				font-family:${props.fontFamily || 'Arial'};
				font-weight:${props.fontWeight || 'normal'};
				font-style:${props.fontStyle || 'normal'};
				text-decoration:${props.textDecoration || 'none'};
				text-align:${align};
				line-height:${props.lineHeight || '1.5'};
				color:${props.color || '#33363C'};
				text-transform:${props.textTransform || 'none'};
				letter-spacing:${props.letterSpacing || 'normal'};
			`.replace(/\s+/g, ' ')

			const additionalStyles = `
				<style>
					.mjml-text-container p { margin: 0 0; padding-left: 10px }
					.mjml-text-container h1, .mjml-text-container h2, .mjml-text-container h3, .mjml-text-container h4 {
						margin-top: 15px; margin-bottom: 10px;
					}
					.mjml-text-container code {
						background-color:#f5f5f5; padding:2px 4px; border-radius:3px; font-family:monospace;
					}
					.mjml-text-container pre {
						background-color:#f5f5f5; padding:10px; border-radius:3px; overflow-x:auto;
					}
					.mjml-text-container blockquote {
						border-left:4px solid #ddd; padding-left:15px; margin-left:0; margin-right:0; font-style:italic;
					}
					.mjml-text-container a { color: inherit; text-decoration: inherit; }
				</style>
			`

			return `
				${additionalStyles}
				<table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
					<tr>
						<td align="${align}" style="padding:${pt} ${pr} ${pb} ${pl}; background:${bg}; border-radius:${radius};">
							<div class="mjml-text-container" style="${textStyle}">
								${htmlContent}
							</div>
						</td>
					</tr>
				</table>
			`
		}

		case 'MjmlButton': {
			const align = props.align === 'left' ? 'left' : props.align === 'right' ? 'right' : 'center'
			const pt = props.paddingTop || '0px'
			const pr = props.paddingRight || '0px'
			const pb = props.paddingBottom || '0px'
			const pl = props.paddingLeft || '0px'
			const bg = props.backgroundColor || '#007bff'
			const color = props.color || '#ffffff'
			const radius = props.borderRadius || '3px'
			const text = props.text || 'Click me'
			const url = props.url || '#'
			const widthCss = props.width && props.width !== 'auto' ? `width:${props.width};` : ''
			const hasFixedH = props.height && props.height !== 'auto'
			const lineHCss = hasFixedH ? `line-height:${props.height};` : ''
			const padCss = hasFixedH ? 'padding:0 16px;' : 'padding:10px 16px;'

			return `
				<table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
					<tr>
						<td align="${align}" style="padding:${pt} ${pr} ${pb} ${pl};">
							<table role="presentation" border="0" cellspacing="0" cellpadding="0">
								<tr>
									<td bgcolor="${bg}" style="border-radius:${radius};">
										<a href="${url}" target="_blank" rel="noopener noreferrer"
											style="display:inline-block; ${widthCss} ${lineHCss} ${padCss}
															background:${bg}; color:${color}; text-decoration:none;
															border-radius:${radius}; text-align:center;
															font-family:Verdana, sans-serif; font-size:16px;
															mso-line-height-rule:exactly;">
											${text}
										</a>
									</td>
								</tr>
							</table>
						</td>
					</tr>
				</table>
			`
		}

		case 'MjmlBlock': {
			const bg = props.background ?? 'transparent'
			const br = props.borderRadius || '0px'
			const parentName = findParentName(nodeId, nodes)
			const isInsideSection = parentName === 'MjmlSection'

			const pt = props.paddingTop || '0px'
			const pr = props.paddingRight || '0px'
			const pb = props.paddingBottom || '0px'
			const pl = props.paddingLeft || '0px'

			const hasBgImage = !!props.hasBgImage
			const bgUrl = props.bgImageUrl
			const bgRepeat = props.bgRepeat || 'no-repeat'
			const bgSize = props.bgSize || 'cover'
			const bgPosition = props.bgPosition || 'center'

			// фон-картинка на ВНУТРЕННИЙ DIV, как в канвасе
			const bgLayerCss =
				hasBgImage && bgUrl
					? `background-image:url('${escapeAttr(bgUrl)}');background-repeat:${bgRepeat};background-size:${bgSize};background-position:${bgPosition};`
					: ''

			const MIN_H = 40
			const rawHeight = props.height
			const explicitNum = rawHeight && rawHeight !== 'auto' ? parseInt(String(rawHeight), 10) : NaN
			const hasExplicit = Number.isFinite(explicitNum)
			const minH = hasExplicit ? Math.max(explicitNum as number, MIN_H) : MIN_H

			const spacer =
				childrenHtml.trim().length === 0
					? `<img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==" width="1" height="${minH}" style="display:block;" alt="" />`
					: ''

			const innerTable = `
    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse:collapse; border-radius:${br};">
      <tr>
        <td valign="top"
            style="vertical-align:top; padding:${pt} ${pr} ${pb} ${pl}; box-sizing:border-box; border-radius:${br}; background-color:${bg};">
          <div style="min-height:${minH}px; border-radius:${br}; overflow:hidden; ${bgLayerCss}">
            ${spacer}${childrenHtml}
          </div>
        </td>
      </tr>
    </table>
  `

			if (isInsideSection) {
				return innerTable
			}

			const rawPct = props.widthPercent
			const pctNum =
				typeof rawPct === 'number' ? rawPct : typeof rawPct === 'string' ? Number(rawPct) : 100
			const pct = Math.max(0, Math.min(100, Number.isFinite(pctNum) ? Math.round(pctNum) : 100))

			const alignExt: 'left' | 'center' | 'right' =
				props.align === 'center' ? 'center' : props.align === 'right' ? 'right' : 'left'

			let leftSpacer = 0,
				rightSpacer = 0
			if (pct < 100) {
				if (alignExt === 'left') {
					leftSpacer = 0
					rightSpacer = 100 - pct
				} else if (alignExt === 'right') {
					leftSpacer = 100 - pct
					rightSpacer = 0
				} else {
					leftSpacer = Math.floor((100 - pct) / 2)
					rightSpacer = Math.max(0, 100 - pct - leftSpacer)
				}
			}

			const spacerTd = (w: number) =>
				w > 0
					? `<td width="${w}%" style="width:${w}%; font-size:0; line-height:0; mso-line-height-rule:exactly;">&nbsp;</td>`
					: ''

			const contentTd = `
    <td width="${pct}%" valign="top" style="vertical-align:top; width:${pct}%;">
      ${innerTable}
    </td>
  `

			return `
    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
      <tr>${spacerTd(leftSpacer)}${contentTd}${spacerTd(rightSpacer)}</tr>
    </table>
  `
		}

		default:
			return childrenHtml
	}
}

export const generateHtmlFromNodes = (
	nodes: Record<NodeId, SerializedNode>,
	rootNodeId: NodeId = 'ROOT'
): string => {
	const bodyContent = convertNodeToHtml(rootNodeId, nodes)

	return bodyContent
}

export const generateFullHtmlDocument = (
	nodes: Record<NodeId, SerializedNode>,
	rootNodeId: NodeId = 'ROOT'
): string => {
	const bodyContent = generateHtmlFromNodes(nodes, rootNodeId)

	return `
    ${bodyContent}
    `
}

// Для обратной совместимости
export const convertNodesToHtml = generateHtmlFromNodes
