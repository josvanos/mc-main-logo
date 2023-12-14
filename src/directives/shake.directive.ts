import { Directive, ElementRef, Input, OnChanges, OnDestroy, Renderer2 } from '@angular/core';

@Directive({
    standalone: true,
    selector: '[appShake]'
})
export class ShakeDirective implements OnChanges {
    @Input('appShake') isShaking!: boolean;


    constructor(private renderer: Renderer2, private el: ElementRef) { }

    ngOnChanges() {
        if (this.isShaking) {
            this.renderer.addClass(this.el.nativeElement, "shake");
            return;
        }

        this.renderer.removeClass(this.el.nativeElement, "shake");
    }



}