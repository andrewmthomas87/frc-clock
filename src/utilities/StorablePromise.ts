
class StorablePromise<T> {

	private _promise: Promise<T>

	public resolve: (value?: T | PromiseLike<T> | undefined) => void
	public reject: (reason?: any) => void

	public constructor() {
		this._promise = new Promise((resolve, reject) => {
			this.resolve = resolve
			this.reject = reject
		})
	}

	public getPromise(): Promise<T> {
		return this._promise
	}

}

export default StorablePromise
