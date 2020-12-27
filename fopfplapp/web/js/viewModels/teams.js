define(["require", "exports", "ojs/ojarraydataprovider", "knockout", "ojs/ojtable", "ojs/ojchart", "ojs/ojselectsingle"], function (require, exports, ArrayDataProvider, ko) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class IncidentsViewModel {
        constructor() {
            this.selectedTeam = ko.observable();
            this.valueChangedHandler = (event) => {
                console.log(event.detail.value);
            };
            var teams = [
                { value: '1', label: 'Marathas' },
                { value: '2', label: 'Chozhas' },
                { value: '3', label: 'Nizams' },
                { value: '4', label: 'Mauryas' },
                { value: '5', label: 'Mughals' },
                { value: '6', label: 'Khiljis' },
                { value: '7', label: 'Travancore' },
                { value: '8', label: 'Nagas' },
                { value: '9', label: 'Vijayanagara' },
                { value: '10', label: 'Zamorins' }
            ];
            this.teamsLovDataProvider = new ArrayDataProvider(teams, { keyAttributes: 'value' });
        }
        /**
         * Optional ViewModel method invoked after the View is inserted into the
         * document DOM.  The application can put logic that requires the DOM being
         * attached here.
         * This method might be called multiple times - after the View is created
         * and inserted into the DOM and after the View is reconnected
         * after being disconnected.
         */
        connected() {
            // implement if needed
        }
        /**
         * Optional ViewModel method invoked after the View is disconnected from the DOM.
         */
        disconnected() {
            // implement if needed
        }
        /**
         * Optional ViewModel method invoked after transition to the new View is complete.
         * That includes any possible animation between the old and the new View.
         */
        transitionCompleted() {
            // implement if needed
        }
    }
    exports.default = IncidentsViewModel;
});
//# sourceMappingURL=teams.js.map