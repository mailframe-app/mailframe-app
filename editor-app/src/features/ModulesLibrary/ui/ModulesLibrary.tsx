import { ModuleList } from './ModuleList'
import { ModuleSearch } from './ModuleSearch'

export const ModulesLibrary = () => {
	return (
		<div className='flex h-full flex-col'>
			<div className='flex-none px-4'>
				<ModuleSearch />
			</div>
			<div className='flex-1 overflow-y-auto p-2'>
				<ModuleList />
			</div>
		</div>
	)
}
