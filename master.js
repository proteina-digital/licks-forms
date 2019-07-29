var send_form = function(form, event){
    event.preventDefault();
    var serializeDados = form.serialize();
    var btn = form.find("input[type='submit']");

    console.log("form: "+form);
    console.log("serializeDados: "+serializeDados);
     
    $.ajax({
        url: 'http://localhost/lickslegal/mailchimp/index.php',
        dataType: 'html',
        type: 'POST',
        data: serializeDados,
        beforeSend: function() {
            btn.val( "SENDING..." );
        },
        success: function(data, textStatus, xhr) {

          console.log("resposta: "+data);
          console.log("status: "+data.status);
          console.log("xhr: "+xhr.status);

          if ( typeof form.attr('redirect') !== 'undefined'  ) {
            window.location = 'http://lickslegal.com/'+form.attr('redirect');
          }else{
            form.parent("div").find('.w-form-done').slideDown();
            form.parent("div").find('.w-form-fail').hide();
            form.hide();
          }
        },
        error: function(xhr,er) {

          console.log('Error ' + xhr.status + ' - ' + xhr.statusText + ' - Tipo de erro: ' + er);

          var erros = [];

          if (xhr.status === 422) {

            erros.push("Seu formulário não foi enviado. Verifique os dados e tente novamente.");
           
          } else {
            erros.push("Erro no Servidor");
          }



          form.parent("div").find('.w-form-fail').html("<p>"+erros[0]+"</p>");
          form.parent("div").find('.w-form-fail').slideDown();
          btn.val("Subscribe");
        }
    });     
}


Webflow.push(function(){
  if(page_is('work-with-us')) {
    $('form[name="wf-form-work-with-us"]').attr('multipart/form-data');
  }

  // news form
    $('form[name="wf-form-newsletter"]').submit(function(event) {
        var form = $(this);
        send_form(form, event);
    });

  // work-with-us form
  $('form[name="wf-form-work-with-us"]').submit(function(event) {
      var form = $(this);
      send_form(form, event);
  })
});