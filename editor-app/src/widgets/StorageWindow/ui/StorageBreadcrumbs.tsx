import type { IconComponent } from '@consta/icons/Icon'
import { IconHome } from '@consta/icons/IconHome'
import { Breadcrumbs } from '@consta/uikit/Breadcrumbs'

import { type Breadcrumb, useStorageNavigation } from '@/entities/Storage'

type BreadcrumbWithIcon = Breadcrumb & {
	icon?: IconComponent
}

export const StorageBreadcrumbs = () => {
	const { currentPath, navigateToFolder } = useStorageNavigation()

	if (!currentPath || currentPath.length <= 1) {
		return null
	}

	const breadcrumbItems: BreadcrumbWithIcon[] = currentPath.map((item: Breadcrumb, index) => {
		if (index === 0) {
			return {
				...item,
				icon: IconHome
			}
		}
		return item
	})

	return (
		<Breadcrumbs
			items={breadcrumbItems}
			getItemLabel={item => item.name}
			onItemClick={item => navigateToFolder(item.id)}
			size='m'
			onlyIconRoot
			fitMode='scroll'
			className='cursor-pointer'
		/>
	)
}
