var fs = require('fs');
var template = fs.readFileSync(__dirname + "/templates/modal.html");


module.exports = {
    init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        // We need to figure out if we have a boolean variable/observable, or an object variable/observable
        var value = valueAccessor(), isObservable = ko.isSubscribable(value),
            realValue = ko.unwrap(value);


        // Just a boolean value, so we'll watch it for changes and
        // show/hide the modal
        // the user is expected to handle the template
        if (typeof realValue === "boolean") {
            if (isObservable) {
                value.subscribe(function(newValue){
                    if (newValue) {
                        $(element).modal("show");
                    }
                    else {
                        $(element.modal("hide"));
                    }
                });
            }
        }

        // Maybe it's an object, so we'll be using our own template for this
        else if (typeof realValue === "object") {
            // this function handles the initial value, and the case of the object
            // being replaced
            var initializeModal = function(settings){
                var context = ko.utils.extend({
                    title: "",
                    content: "",
                    buttons: ["Cancel", "OK"],
                    show: false
                }, settings);

                // if we've already applied bindings, we need to clean up first
                //ko.cleanNode(element);

                // load our module template
                element.innerHTML = template;

                console.log(context);

                if (ko.isSubscribable(context.show)) {
                    context.show.subscribe(function(newValue){
                        console.log(element, "dasdasfa");
                        if (newValue) {
                            $(element).modal("show");
                        }
                        else {
                            $(element.modal("hide"));
                        }
                    });
                }

                // we need our own onHide and onShow methods to make sure
                // our observable stays in check, but we don't want to override
                // callbacks the user sets


                ko.applyBindingsToDescendants(context, element);
            };

            if (isObservable) {
                value.subscribe(initializeModal);
            }
            else {
                initializeModal(realValue);
            }

            return { controlsDescendantBindings: true };
        }

        var newProperties = valueAccessor(),
            innerBindingContext = bindingContext.extend(newProperties);



    }
};