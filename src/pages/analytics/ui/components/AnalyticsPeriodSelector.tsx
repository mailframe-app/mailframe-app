import { ChoiceGroup } from '@consta/uikit/ChoiceGroup'

import { ANALYTICS_PERIODS, ANALYTICS_PERIOD_LABELS } from '../../lib/constants'
import type {
	AnalyticsPeriod,
	AnalyticsPeriodSelectorProps
} from '../../lib/types'

/**
 * Компонент выбора периода аналитики
 */
export function AnalyticsPeriodSelector({
	period,
	onPeriodChange
}: AnalyticsPeriodSelectorProps) {
	return (
		<div className='flex items-center justify-center'>
			<ChoiceGroup<AnalyticsPeriod>
				items={ANALYTICS_PERIODS as AnalyticsPeriod[]}
				value={period}
				className='choice-group-no-border'
				onChange={onPeriodChange}
				getItemLabel={item => ANALYTICS_PERIOD_LABELS[item]}
				name='analytics-period'
				style={{
					backgroundColor: 'var(--color-bg-default)'
				}}
			/>
		</div>
	)
}
