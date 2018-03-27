$.widget( "ui.autocomplete", $.ui.autocomplete, {

    options: {
        delay: 500,
        minLength: 2,
        select: function(event, ui) {
            $(event.target).attr("data-id", ui.item.id);
            $('.' + event.target.id + '-add').prop('disabled', false);
        },
        change: function( event, ui ) {
            if(!ui.item){
                $(event.target).removeAttr("data-id");
                $(event.target).val("");
                $('.' + event.target.id + '-add').prop('disabled', true);
            }
        },
        source: function( request, response ) {
            $.ajax({
                url: path + this.element.data("url"),
                contentType:"application/json; charset=utf-8",
                data: {
                    query: request.term
                },
                success: function( data ) {
                    response( data );
                }
            });
        }
    },

    _renderItem: function( ul, item ) {
        var label = item.label;
        if (this.options.prefix) {
            label = this.options.prefix + " " + label;
        }

        return $( "<li>" )
            .append(label)
            .appendTo( ul );
    }

});

var autocompletemultiple = {

    data: {},

    montaHtmlAutoComplete: function(elements){

        var self = this;

        elements.each(function (index) {

            var element = elements[index];
            var $elementName = element.getAttribute('data-elementid');
            self.data[$elementName] = [];


            $(element).append("" +
                "<div class='form-group floating-label'>" +
                "   <div class='input-group'>" +
                "       <div class='input-group-content'>" +
                "           <input type='text' id='" + $elementName + "' name='" + $elementName + "'" +
                "           class='form-control'" +
                "           data-url='" + element.getAttribute("data-url") + "'>" +
                "           <label for='" + $elementName + "'>" + element.getAttribute('data-labeltext') + "</label>" +
                "       </div>" +
                "       <div class='input-group-btn'>" +
                "           <button class='btn btn-default " + $elementName + "-add' type='button' disabled data-placement='top' title='' data-original-title='Adicionar Item'>" +
                "               <i class='fa fa-plus'></i>" +
                "           </button>" +
                "           <button class='btn btn-primary " + $elementName + "-see' type='button' data-placement='top' title='' data-original-title='Visualizar Lista'>" +
                "               <i class='fa fa-list'></i>" +
                "           </button>" +
                "       </div>" +
                "   </div>" +
                "</div>" +
                "<div class='row'>" +
                "   <div class='" + $elementName + "-data-list autocompletemultipledata'>" +
                "       <div class='card'>" +
                "           <div class='card-head card-head-sm style-primary'>" +
                "               <header>" +
                "                   Lista" +
                "               </header>" +
                "               <div class='tools'>" +
                "                   <a class='btn btn-icon-toggle btn-close'>" +
                "                       <i class='fa fa-close " + $elementName + "-close'></i>" +
                "                   </a>" +
                "               </div>" +
                "           </div>" +
                "           <div class='card-body'>" +
                "               <table class='table table-striped no-margin'>" +
                "                   <thead>" +
                "                       <tr>" +
                "                           <th class='text-center'>Item</th>" +
                "                           <th class='text-center'>Remover</th>" +
                "                       </tr>" +
                "                   </thead>" +
                "                   <tbody class='" + $elementName + "-list'>" +
                "                       <tr>" +
                "                           <td colspan='2' class='text-center'> Não foram adicionados itens à lista! </td>" +
                "                       </tr>" +
                "                   </tbody>" +
                "               </table>" +
                "           </div>" +
                "       </div>" +
                "   </div>" +
                "</div>");

            $('body').append("<div class='" + $elementName + "-databackground autocompletemultipledatabackground'></div>");

            var $element = $('#' + $elementName);
            var $btnAdd = $('.' + $elementName + '-add');
            var $btnSeeList = $('.' + $elementName + '-see');
            var $btnClose = $('.' + $elementName + '-close');
            var $dataList = $('.' + $elementName + '-data-list');
            var $list = $('.' + $elementName + '-list');
            var $dataListBackground = $('.' + $elementName + '-databackground');

            $element.keyup(function (e) {
                if (e.target.value.length === 0 || e.value === "") {
                    $btnAdd.prop('disabled', true);
                }
            });

            $btnAdd.click(function () {

                var elementValue = persistence.getSelectSingle($element);

                if (elementValue !== null || elementValue !== "") {

                    var item = {
                        id: $element.attr("data-id"),
                        text: elementValue.id
                    };

                    if (self.data[$elementName].indexOf(item.id) === -1) {
                        if(self.data[$elementName].length === 0){
                            $list.empty();
                        }
                        self.data[$elementName].push(item.id);
                        self.montaHtmlLista($list, $elementName, item);
                        $element.val("");
                        self.disableButtons($btnAdd, true);
                        toast.success("Item adicionado a lista!", "Sucesso");
                    } else {
                        toast.error("Este Item já foi adicionado a lista!", "Erro");
                    }

                    window.materialadmin.AppForm.initialize();;

                } else {
                    toast.error("Selecione ao menos um item para então adicionar a lista!", "Erro");
                }
            });

            $btnSeeList.click(function () {
                $dataListBackground.fadeIn(function () {
                    $dataList.animate({height: 'toggle'});
                });
            });

            $btnClose.click(function () {
                $dataList.animate({height: 'toggle'}, function () {
                    $dataListBackground.fadeOut();
                });
            });

            $element.autocomplete();

        });
    },

    montaHtmlLista: function ($list, $elementName,  item) {

        var self = this;

        $list.append("" +
            "<tr id='" + $elementName + "-list-" + item.id + "'>" +
            "   <td class='text-center'>"+ item.text +"</td>" +
            "   <td class='text-center'>" +
            "       <button type='button' " +
            "       data-toggle='tooltip' " +
            "       data-placement='top' " +
            "       title='' " +
            "       data-original-title='Remover Item' " +
            "       style='border:0; background-color: transparent;' " +
            "       class='" + $elementName + "-remove' " +
            "       data-id='" + item.id + "'>" +
            "           <span class='label label-danger'>" +
            "               <i class='fa fa-trash'></i>" +
            "           </span>" +
            "       </button>" +
            "   </td>" +
            "</tr>");

        var $elementList = $('#' + $elementName + "-list-" + item.id);
        var $btnRemove = $('.' + $elementName + '-remove');

        $btnRemove.click(function () {
            var id = $(this).attr("data-id");
            $elementList.remove();
            if(self.data[$elementName].length -1 === 0){
                $list.empty().append("<tr>" +
                    "   <td colspan='2' class='text-center'> Não foram adicionados itens à lista! </td>" +
                    "</tr>");
            }
            self.data[$elementName].splice(id);
            toastr.success("Item removido com sucesso!", "Sucesso")
        });

    },

    disableButtons: function ($el, trueOrFalse) {
       $el.prop('disabled', trueOrFalse);
    },

    getAutoCompleteValues: function (element) {
        return this.data[element];
    }

};

$(function () {
    autocompletemultiple.montaHtmlAutoComplete($('.autocompletemultiple'));
});


/*
    ****Tag HTML utilizada para montar o autocomplete.
    <div class="autocompletemultiple" data-url="url de resposta da chamada ajax"
    data-elementid="id do input text" data-labeltext="texto para a label do input"></div>
 */