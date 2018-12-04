export class Paging {
	public pageNumber: number;
	public pageSize: number;
	public totalItems: number;
	public totalPages: number;
	public pageArray: number[];
	constructor(modelList: any[]) {
		this.pageNumber = 1;
		this.pageSize = 5;
		this.totalItems = modelList.length;
		this.totalPages = Math.ceil(this.totalItems / (this.pageSize + 0.0));
		this.pageArray = Array(this.totalPages).fill(null).map((x, i) => i + 1);
	}
}
