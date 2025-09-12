export function inlineEmailTablesAndImages(html: string): string {
	const appendStyle = (attrs: string, addition: string): string => {
		if (/style\s*=/i.test(attrs)) {
			return attrs.replace(/style="([^"]*)"/i, (_match: string, captured: string): string => {
				const trimmed = captured.trim().replace(/;?\s*$/, '')
				return `style="${trimmed};${addition}"`
			})
		}
		return `${attrs} style="${addition}"`
	}

	const ensureAttr = (attrs: string, name: string, value: string): string =>
		new RegExp(`\\b${name}\\s*=`, 'i').test(attrs) ? attrs : `${attrs} ${name}="${value}"`

	// <table ...>
	html = html.replace(/<table([^>]*)>/gi, (_match: string, attrs: string): string => {
		let a = appendStyle(attrs, 'width:100%;border-collapse:collapse;table-layout:auto;')
		a = ensureAttr(a, 'width', '100%')
		a = ensureAttr(a, 'role', 'presentation')
		a = ensureAttr(a, 'cellpadding', '0')
		a = ensureAttr(a, 'cellspacing', '0')
		a = ensureAttr(a, 'border', '0')
		return `<table${a}>`
	})

	// <th ...>
	html = html.replace(/<th([^>]*)>/gi, (_match: string, attrs: string): string => {
		const a = appendStyle(
			attrs,
			'border:1px solid #d4d4d4;padding:6px 8px;background:#f5f7fa;text-align:center;vertical-align:middle;'
		)
		return `<th${a}>`
	})

	// <td ...>
	html = html.replace(/<td([^>]*)>/gi, (_match: string, attrs: string): string => {
		const a = appendStyle(
			attrs,
			'border:1px solid #d4d4d4;padding:6px 8px;background:#ffffff;text-align:left;vertical-align:middle;'
		)
		return `<td${a}>`
	})

	// <img ...>
	html = html.replace(/<img([^>]*)>/gi, (_match: string, attrs: string): string => {
		const a = appendStyle(attrs, 'max-width:100%;height:auto;display:block;')
		return `<img${a}>`
	})

	return html
}
