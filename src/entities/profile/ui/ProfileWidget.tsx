import { User } from '@consta/uikit/User'

import styles from './ProfileWidget.module.css'
import { useProfile } from '@/entities/profile'

export function ProfileWidget() {
	const currentUser = useProfile()

	if (!currentUser) {
		return null
	}

	const wrapperClasses = ['mt-1', 'select-none']
	if (currentUser.avatar) {
		wrapperClasses.push(styles.wrapper)
	}

	return (
		<div className={wrapperClasses.join(' ')}>
			<User
				avatarUrl={currentUser?.avatar ?? undefined}
				name={currentUser?.displayName}
				size='m'
				info={currentUser?.organization ?? ''}
				status={currentUser?.isEmailVerified ? undefined : 'out'}
			/>
		</div>
	)
}
