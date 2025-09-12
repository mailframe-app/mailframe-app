import { useLoaderData } from 'react-router-dom'

import { ModalRoot } from '@/shared/lib'

import { BeforeUnloadHandler, CleanupHandler } from './lib'
import { EditorView } from './ui/EditorVIew'
import { EditorTemplateProvider, type TemplateDetailDto } from '@/entities/EditorTemplate'
import { type GetBlocksResponseDto, ReusableBlocksProvider } from '@/entities/ReusableBlocks'
import { type GetTagsResponseDto, TagsStoreProvider } from '@/entities/Tags'

interface LoaderData {
	template: TemplateDetailDto
	blocks: GetBlocksResponseDto
	tags: GetTagsResponseDto
}

export const EditorPage = () => {
	const { template, blocks, tags } = useLoaderData() as LoaderData

	return (
		<EditorTemplateProvider key={template.id} value={template}>
			<ReusableBlocksProvider value={blocks}>
				<TagsStoreProvider value={tags}>
					<div className='flex h-[100vh] flex-col overflow-hidden bg-[#282c34]'>
						{/* Основной компонент страницы редактора */}
						<EditorView />
						{/* Вспомогательные компоненты для работы с unsaved changes */}
						<BeforeUnloadHandler />
						<CleanupHandler />
					</div>
					<ModalRoot />
				</TagsStoreProvider>
			</ReusableBlocksProvider>
		</EditorTemplateProvider>
	)
}
