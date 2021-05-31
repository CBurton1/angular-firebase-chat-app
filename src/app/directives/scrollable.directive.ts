import { Directive, HostListener, EventEmitter, Output, ElementRef } from "@angular/core";

@Directive({
  selector: "[afcaScrollable]"
})
export class ScrollableDirective {
  @Output() scrollPosition = new EventEmitter();

  constructor(public el: ElementRef) {}

  @HostListener("scroll", ["$event"])
  public onScroll(event: any): void {
    const top = event.target.scrollTop;
    const height = this.el.nativeElement.scrollHeight;
    const offset = this.el.nativeElement.offsetHeight;

    if (top > height) {
      this.scrollPosition.emit("bottom");
    }

    if (top === 0) {
      this.scrollPosition.emit("top");
    }
  }
}
