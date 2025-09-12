// Ответ на запрос на получение URL для внешней авторизации
export interface ExternalConnectResponse {
	url: string
}

// Параметры для callback контроллера внешней авторизации
export type ExternalControllerCallbackParams = {
	code: string
	state: string
}

// Ответ на запрос на получение статуса внешней авторизации
export interface ExternalStatusResponse {
	yandex: boolean
	google: boolean
}
