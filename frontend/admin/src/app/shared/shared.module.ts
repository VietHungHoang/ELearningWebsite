import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TruncatePipe } from './pipes/truncate.pipe';

const SHARED_PIPES = [TruncatePipe];

@NgModule({
    declarations: [],
    imports: [CommonModule, ...SHARED_PIPES],
    exports: [...SHARED_PIPES]
})
export class SharedModule {}
