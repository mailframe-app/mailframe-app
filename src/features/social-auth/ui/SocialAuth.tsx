import { Button } from '@consta/uikit/Button'
import { Layout } from '@consta/uikit/Layout'
import { Text } from '@consta/uikit/Text'
import { FaYandex } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'

import { useOAuthLogin } from '../model/use-oauth-login'

export function SocialAuth() {
	const { oauthLogin, isPending } = useOAuthLogin()

	return (
		<Layout direction='column'>
			<div className='mt-6 mb-4 flex items-center'>
				<div
					className='flex-grow border-t'
					style={{
						borderColor: 'var(--color-control-bg-border-default)'
					}}
				/>
				<Text as='span' className='mx-4 text-xs' view='secondary'>
					или
				</Text>
				<div
					className='flex-grow border-t'
					style={{
						borderColor: 'var(--color-control-bg-border-default)'
					}}
				/>
			</div>
			<div className='flex flex-col gap-4 pt-2'>
				<Button
					onClick={() => oauthLogin('google')}
					view='ghost'
					size='m'
					iconLeft={props => <FcGoogle className={props.className} />}
					label='Войти через Google'
					loading={isPending}
				/>
				<Button
					onClick={() => oauthLogin('yandex')}
					view='ghost'
					size='m'
					iconLeft={props => <FaYandex className={props.className} />}
					label='Войти через Яндекс'
					loading={isPending}
				/>
			</div>
		</Layout>
	)
}
