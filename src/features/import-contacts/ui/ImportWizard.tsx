import { Button } from '@consta/uikit/Button'
import { ProgressStepBar } from '@consta/uikit/ProgressStepBar'
import { useCallback, useMemo, useState } from 'react'

import { showCustomToast } from '@/shared/lib/toaster'

import MappingStep from '../mapping/MappingStep'
import OptionsStep from '../options/OptionsStep'
import StatusStep from '../status/StatusStep'
import UploadStep from '../upload/UploadStep'

import type {
	ContactFieldType,
	StartImportDto
} from '@/entities/contacts/api/types'
import {
	useContactFields,
	useStartImportMutation,
	useUploadImportFileMutation
} from '@/entities/contacts/model'

export type MappingItem = {
	fieldKey: string
	createNewField?: {
		key: string
		name: string
		fieldType: ContactFieldType
	}
}

export type MappingState = Record<string, MappingItem>

export type MappingOptionsState = {
	updateStrategy: 'insert' | 'update_mapped' | 'replace_mapped'
	restoreSoftDeleted: boolean
	ignoreEmptyValues: boolean
	valueMerge: 'last_wins' | 'first_wins'
}

export type ImportOptionsState = {
	createNewFields?: boolean
	groupId?: string
	groupMode?: 'add' | 'replace'
}

const MAX_FILE_SIZE = 10 * 1024 * 1024
const ACCEPTED_EXT = ['.csv', '.xls', '.xlsx', '.txt']

function ImportWizard() {
	const [currentStep, setCurrentStep] = useState<number>(0)
	const [importId, setImportId] = useState<string | null>(null)
	const [headers, setHeaders] = useState<string[]>([])
	const [mapping, setMapping] = useState<MappingState>({})
	const [mappingOptions, setMappingOptions] = useState<MappingOptionsState>({
		updateStrategy: 'update_mapped',
		restoreSoftDeleted: false,
		ignoreEmptyValues: true,
		valueMerge: 'last_wins'
	})
	const [options, setOptions] = useState<ImportOptionsState>({
		createNewFields: true,
		groupMode: 'add'
	})
	const [hasStarted, setHasStarted] = useState<boolean>(false)

	const uploadMutation = useUploadImportFileMutation()
	const startMutation = useStartImportMutation()

	const { data: fieldsData } = useContactFields()

	const canGoToMapping = Boolean(importId) && headers.length > 0
	const isMappingValid = useMemo(() => {
		if (!mapping) return false
		const values = Object.values(mapping)
		const hasEmail = values.some(
			v => v.fieldKey === 'email' || v.createNewField?.key === 'email'
		)
		return hasEmail
	}, [mapping])

	const isOptionsValid = useMemo(() => {
		return true
	}, [])

	const onUpload = useCallback(
		async (file: File) => {
			if (!file) return
			if (file.size > MAX_FILE_SIZE) {
				showCustomToast({
					title: 'Файл больше 10 МБ',
					type: 'error'
				})
				return
			}
			const lower = file.name.toLowerCase()
			const ok = ACCEPTED_EXT.some(ext => lower.endsWith(ext))
			if (!ok) {
				showCustomToast({
					title: 'Поддерживаются только CSV, XLS, XLSX',
					type: 'error'
				})
				return
			}
			const fd = new FormData()
			fd.append('file', file)
			try {
				const res = await uploadMutation.mutateAsync(fd)
				setImportId(res.importId)
				setHeaders(res.headers || [])
				// авто-guess базового маппинга
				const auto: MappingState = {}
				;(res.headers || []).forEach(h => {
					const l = h.toLowerCase()
					if (l.includes('email')) auto[h] = { fieldKey: 'email' }
					else if (l.includes('name')) auto[h] = { fieldKey: 'fullName' as any }
					else if (l.includes('phone') || l.includes('тел'))
						auto[h] = { fieldKey: 'phone' as any }
				})
				setMapping(auto)
				setCurrentStep(1)
				showCustomToast({
					title: 'Файл успешно загружен',
					type: 'success'
				})
			} catch (e: any) {
				showCustomToast({
					title: e?.message || 'Не удалось загрузить файл',
					type: 'error'
				})
			}
		},
		[uploadMutation]
	)

	const goNext = useCallback(() => {
		if (currentStep === 0 && !canGoToMapping) return
		if (currentStep === 1 && !isMappingValid) {
			showCustomToast({
				title: 'Не указан email в маппинге',
				type: 'error'
			})
			return
		}
		if (currentStep === 2 && !isOptionsValid) {
			showCustomToast({
				title: 'Режим группы выбран некорректно',
				type: 'error'
			})
			return
		}
		setCurrentStep(s => Math.min(s + 1, 3))
	}, [currentStep, canGoToMapping, isMappingValid, isOptionsValid])

	const goPrev = useCallback(() => setCurrentStep(s => Math.max(0, s - 1)), [])

	const onStart = useCallback(async () => {
		if (!importId) return
		const payload: StartImportDto = {
			mapping: mapping as any,
			...mappingOptions,
			createNewFields: Boolean(options.createNewFields),
			...(options.groupId
				? { groupId: options.groupId, groupMode: options.groupMode }
				: {})
		}
		try {
			await startMutation.mutateAsync({ id: importId, payload })
			showCustomToast({
				title: 'Импорт запущен',
				type: 'success'
			})
			setHasStarted(true)
			setCurrentStep(3)
		} catch (e: any) {
			showCustomToast({
				title: e?.message || 'Ошибка запуска импорта',
				type: 'error'
			})
		}
	}, [importId, mapping, mappingOptions, options, startMutation])

	const progressSteps = useMemo(() => {
		return [
			{
				label: 'Загрузка',
				point: 1,
				status: currentStep > 0 ? 'success' : 'normal',
				lineStatus: currentStep > 0 ? 'success' : 'normal'
			},
			{
				label: 'Сопоставление полей',
				point: 2,
				status: currentStep > 1 ? 'success' : 'normal',
				lineStatus: currentStep > 1 ? 'success' : 'normal'
			},
			{
				label: 'Группа',
				point: 3,
				status: currentStep > 2 ? 'success' : 'normal',
				lineStatus: currentStep > 2 ? 'success' : 'normal'
			},
			{
				label: 'Статус',
				point: 4,
				status: currentStep === 3 ? 'warning' : 'normal',
				lineStatus: currentStep === 3 ? 'warning' : 'normal'
			}
		]
	}, [currentStep])

	const handleStepClick = useCallback(
		(_: unknown, ctx: { index: number }) => {
			const idx = ctx.index
			if (idx < currentStep) {
				setCurrentStep(idx)
				return
			}
			if (idx === 1 && canGoToMapping) setCurrentStep(1)
			if (idx === 2 && isMappingValid) setCurrentStep(2)
			if (idx === 3 && hasStarted) setCurrentStep(3)
		},
		[currentStep, canGoToMapping, isMappingValid, hasStarted]
	)

	const stepContent = useMemo(() => {
		switch (currentStep) {
			case 0:
				return (
					<UploadStep
						acceptedExt={ACCEPTED_EXT}
						maxSize={MAX_FILE_SIZE}
						onFileSelected={onUpload}
					/>
				)
			case 1:
				return (
					<MappingStep
						headers={headers}
						fields={fieldsData?.fields || []}
						mapping={mapping}
						onChange={setMapping}
						options={mappingOptions}
						onOptionsChange={setMappingOptions}
						createNewFields={Boolean(options.createNewFields)}
						onToggleCreateNewFields={(v: boolean) =>
							setOptions(prev => ({
								...prev,
								createNewFields: v
							}))
						}
					/>
				)
			case 2:
				return <OptionsStep options={options} onChange={setOptions} />
			case 3:
				return <StatusStep importId={importId!} />
			default:
				return null
		}
	}, [
		currentStep,
		onUpload,
		headers,
		fieldsData?.fields,
		mapping,
		mappingOptions,
		options,
		importId
	])

	return (
		<div className='mt-6 flex w-full max-w-[980px] flex-col gap-4'>
			<ProgressStepBar
				steps={progressSteps}
				activeStepIndex={currentStep}
				onItemClick={handleStepClick as any}
			/>

			<div className='mt-4'>{stepContent}</div>

			<div className='mt-2 flex justify-between'>
				<Button
					view='ghost'
					label='Назад'
					disabled={currentStep === 0}
					onClick={goPrev}
				/>
				{currentStep < 2 && (
					<Button
						view='primary'
						label='Далее'
						onClick={goNext}
						disabled={
							(currentStep === 0 && !canGoToMapping) ||
							(currentStep === 1 && !isMappingValid)
						}
					/>
				)}
				{currentStep === 2 && (
					<Button
						view='primary'
						label='Запустить импорт'
						onClick={onStart}
						disabled={!isOptionsValid}
					/>
				)}
			</div>
		</div>
	)
}

export default ImportWizard
