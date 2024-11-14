export class Password {
	constructor(private readonly value: string) {}

	get password() {
		return this.value
	}

	public static isValid(password: string): boolean {
		/*
      - Minimum 8 characters
      - Maximum 16 characters
      - At least one uppercase letter
      - At least one lowercase letter
      - At least one number
      - At least one special character
      - No spaces or tabs
    */
		const passwordRegex =
			/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/

		return passwordRegex.test(password)
	}
}
