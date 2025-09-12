// Запрос на регистрацию пользователя
export interface RegisterUserRequest {
	name: string
	email: string
	password: string
}

// Ответ на регистрацию пользователя
export interface RegisterUserResponse {
	id: string
	token: string
	userId: string
}
