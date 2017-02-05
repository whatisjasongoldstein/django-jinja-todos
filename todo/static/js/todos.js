(function(window, document, $){

    /**
     * Datastore.
     */
    window.app = {
        init: function() {
            this.data = JSON.parse(document.getElementById("data").innerText);
            this.$el = $(".todoapp");
            this.bindEvents();
        },
        bindEvents: function() {

            var self = this;

            /**
             * Select todo
             */
            this.$el.on("click", ".view label", function(){
                var $item = $(this).closest(".todo-item")
                $item.addClass("editing");
                var $input = $item.find(".edit");

                // Moves cursor to the end of the line.
                $input.val($input.val()).focus();
            });

            this.$el.on("blur", ".edit", function() {
                var todo = self.getTodoFromElement(this);
                if (this.value !== todo.name) {
                    todo.name = this.value;
                    self.saveTodo();
                    self.render();
                } else {
                    $(this).closest("li").removeClass("editing");
                }
            });
        },

        /**
         * Given any element, climb the tree
         * until you find the todo's id, and look
         * it up in the data.
         */
        getTodoFromElement: function(el) {
            var id = $(el).closest("[data-id]").data().id;
            var results = $.grep(this.data.todos, function(item) {
                return item.id === id;
            });
            return results[0];
        },

        addTodo: function(todo) {
            this.render()
        },

        removeTodo: function(todo) {
            this.render()
        },

        saveTodo: function(todo) {
            console.log("Saved to an api!");
        },

        render: function() {
            var html = nunjucks.render("components/todolist.njk", {
                items: this.data.todos,
            });
            this.$el.html(html);
        },
    }

    app.init();

})(window, document, jQuery);