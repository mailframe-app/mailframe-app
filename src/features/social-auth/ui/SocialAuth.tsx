import { Button } from '@consta/uikit/Button'
import { Layout } from '@consta/uikit/Layout'
import { Text } from '@consta/uikit/Text'
import { FcGoogle } from 'react-icons/fc'
import { Link } from 'react-router-dom'

import { YandexIcon } from '@/shared/ui/YandexIcon'

import { useOAuthLogin } from '../model/use-oauth-login'

interface SocialAuthProps {
	description: string
	linkText: string
	linkTo: string
}

export function SocialAuth({ description, linkText, linkTo }: SocialAuthProps) {
	const { oauthLogin, isPending } = useOAuthLogin()

	return (
		<Layout direction='column' className='mt-8 w-full'>
			<div className='grid grid-cols-2 gap-4'>
				<div className='flex h-6 flex-col items-center justify-center self-center border-r border-[var(--color-control-bg-border-default)]'>
					<Text view='primary' size='s' weight='regular'>
						{description}
					</Text>
					<Link to={linkTo}>
						<Text
							view='primary'
							size='s'
							weight='medium'
							className='cursor-pointer underline'
						>
							{linkText}
						</Text>
					</Link>
				</div>
				<div className='flex flex-col items-center justify-center sm:flex-row'>
					<Text view='primary' size='s' weight='regular' className='mr-2'>
						Быстрый вход:
					</Text>
					<div className='flex items-center justify-center'>
						<Button
							onClick={() => oauthLogin('google')}
							view='clear'
							size='s'
							onlyIcon
							iconLeft={props => <FcGoogle className={props.className} />}
							label='Google'
							loading={isPending}
							className='!border-[var(--color-control-bg-border-default)]'
						/>
						<Button
							onClick={() => oauthLogin('yandex')}
							view='clear'
							onlyIcon
							size='s'
							iconLeft={props => <YandexIcon className={props.className} />}
							label='Яндекс'
							loading={isPending}
							className='!border-[var(--color-control-bg-border-default)]'
						/>
					</div>
				</div>
			</div>
		</Layout>
	)
}
