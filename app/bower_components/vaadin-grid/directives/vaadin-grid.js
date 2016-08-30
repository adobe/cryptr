System.register(['@angular/core'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1;
    var Polymer, VaadinGrid;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            console.warn('The `VaadinGrid` directive is deprecated. Please use ' +
                '`PolymerElement(\'vaadin-grid\')` from the `@vaadin/angular2-polymer` ' +
                'npm package instead.');
            Polymer = window.Polymer;
            VaadinGrid = (function () {
                function VaadinGrid(el) {
                    this.gridReady = new core_1.EventEmitter(false);
                    if (!Polymer || !Polymer.isInstance(el.nativeElement)) {
                        console.error("vaadin-grid has not been registered yet, please remember to import vaadin-grid.html in your main HTML page.");
                        return;
                    }
                    this.grid = el.nativeElement;
                }
                VaadinGrid.prototype.ngAfterViewInit = function () {
                    var _this = this;
                    // Configuration <table> might be placed in a wrong container.
                    // Let's move it in the light dom programmatically to fix that.
                    var localDomTable = this.grid.querySelector("table:not(.vaadin-grid)");
                    if (localDomTable) {
                        Polymer.dom(this.grid).appendChild(localDomTable);
                    }
                    this.grid.then(function () {
                        _this.gridReady.emit(_this.grid);
                    });
                };
                __decorate([
                    core_1.Output('grid-ready'), 
                    __metadata('design:type', core_1.EventEmitter)
                ], VaadinGrid.prototype, "gridReady", void 0);
                VaadinGrid = __decorate([
                    core_1.Directive({ selector: 'vaadin-grid' }), 
                    __metadata('design:paramtypes', [core_1.ElementRef])
                ], VaadinGrid);
                return VaadinGrid;
            }());
            exports_1("VaadinGrid", VaadinGrid);
        }
    }
});

//# sourceMappingURL=vaadin-grid.js.map
