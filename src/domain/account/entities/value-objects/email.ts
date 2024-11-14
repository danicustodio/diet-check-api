export class Email {
	constructor(private readonly value: string) {}

	get email() {
		return this.value
	}

	public static isValid(email: string): boolean {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		return emailRegex.test(email)
	}
}
