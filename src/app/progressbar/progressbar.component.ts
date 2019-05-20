import {
    Component,
    OnInit,
    Input,
    Output,
    HostBinding,
    ViewChild,
    ElementRef,
    HostListener,
    EventEmitter,
    OnChanges
} from '@angular/core';

@Component({
    selector: 'app-progressbar',
    templateUrl: './progressbar.component.html',
    styleUrls: ['./progressbar.component.scss']
})
export class ProgressbarComponent implements OnInit, OnChanges {
    @Input() width: number;
    @Input() height: number;
    @Input() min?: number = 0;
    @Input() max?: number = 100;
    @Input() value: number;
    @Input() progressStyle: { [key: string]: string | number };
    @Input() progressMainStyle: { [key: string]: string | number };
    @Input() progressSecondaryStyle: { [key: string]: string | number };
    @Input() progressThumbStyle: { [key: string]: string | number };

    @Output() valueChange: EventEmitter<number> = new EventEmitter();

    // @HostBinding('style.width')
    // private _width: string = '100%';
    // @HostBinding('style.height')
    // private _height: string = '100%';
    _progressStyle = {};
    _progressMainStyle = {};
    _progressSecondaryStyle = {};
    _progressThumbStyle = {};
    private _value: number = 0;
    private _isHolding: boolean = false;

    @ViewChild('progressMain')
    private _progressMainRef: ElementRef<HTMLDivElement>;
    @ViewChild('progressThumb')
    private _progressThumbRef: ElementRef<HTMLDivElement>;

    _progressMainWidth = 0;
    _progressThumbLeft = 0;

    constructor(private el: ElementRef<HTMLDivElement>) {}

    ngOnInit() {
        if (this.value) this._value = this.value;
        if (this.value) this._value = this.value;
    }

    ngOnChanges() {
        this._value = this.value;
        this._progressMainWidth =
            (this.value / this.max) *
            (this.el.nativeElement.clientWidth -
                this._progressThumbRef.nativeElement.clientWidth);
        this._progressThumbLeft =
            (this.value / this.max) *
            (this.el.nativeElement.clientWidth -
                this._progressThumbRef.nativeElement.clientWidth);
    }

    onmousedown() {
        this._isHolding = true;
    }

    @HostListener('document:mousemove', ['$event'])
    onmousemove(ev: MouseEvent) {
        ev.stopPropagation();
        ev.preventDefault();
        // ev.movementX / this._elWidth
        const progressMainWidth = this._progressMainRef.nativeElement
            .clientWidth;
        if (this._isHolding) {
            if (
                progressMainWidth >= 0 &&
                progressMainWidth <=
                    this.el.nativeElement.clientWidth -
                        this._progressThumbRef.nativeElement.clientWidth
            ) {
                // @ts-ignore
                // @ts-ignore
                let len =
                    ev.clientX -
                        this.el.nativeElement.getBoundingClientRect().left;
                this._progressMainWidth = len;
                this._progressThumbLeft = len;
                this._value =
                    (len / this.el.nativeElement.clientWidth) *
                    (this.max - this.min);
            } else if (progressMainWidth < 0) {
                this._progressMainWidth = 0;
                this._progressThumbLeft = 0;
                this._value = this.min;
            } else if (
                progressMainWidth >
                this.el.nativeElement.clientWidth -
                    this._progressThumbRef.nativeElement.clientWidth
            ) {
                this._progressMainWidth =
                    this.el.nativeElement.clientWidth -
                    this._progressThumbRef.nativeElement.clientWidth;
                this._progressThumbLeft =
                    this.el.nativeElement.clientWidth -
                    this._progressThumbRef.nativeElement.clientWidth;
                this._value = this.max;
            }

            // console.log(
            //     this._value,
            //     this.el.nativeElement.clientWidth,
            //     this.max
            // );
            this.valueChange.emit(this._value);
        }
        return false;
    }

    @HostListener('document:mouseup')
    onmouseup() {
        this._isHolding = false;
    }

    @HostListener('document:mouseleave')
    onmouseout() {
        this._isHolding = false;
        // console.log('mouse leave');
    }
}
