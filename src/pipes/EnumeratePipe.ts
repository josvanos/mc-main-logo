import { Pipe, PipeTransform } from "@angular/core";

//https://stackoverflow.com/questions/36354325/angular-2-ngfor-using-numbers-instead-collections
@Pipe({
    name: 'enumerate',
    standalone: true,
})
export class EnumeratePipe implements PipeTransform {
    transform(n: number): number[] {
        return [...Array(n)].map((_, i) => i);
    }
}