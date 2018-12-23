import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'duration'
})
export class DurationPipe implements PipeTransform {
	transform(value: number, args?: any): string {
		const dur = Math.floor(value);
		const sec = dur % 60;
		let min = (dur - sec) / 60;
		const hour = Math.floor(min / 60);
		min = min % 60;
		const strDur =
			(hour > 0 ? (hour > 9 ? hour : '0' + hour) + ':' : '') +
			(min > 0 ? (min > 9 ? min : '0' + min) + ':' : '') +
			(sec > 9 ? sec : '0' + sec);
		console.log(strDur);
		return strDur;
	}
}
