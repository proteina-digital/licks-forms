var send_form_file = function (form, event, url) {
  event.preventDefault();
  var btn = form.find("input[type='submit']");
  var form_dados;


  $('#fileUpload').change(function (event) {
      form_dados = new FormData(form);
      form_dados.append('fileUpload', event.target.files[0]); // para apenas 1 arquivo
      //var name = event.target.files[0].content.name; // para capturar o nome do arquivo com sua extenção
  });

  $.ajax({
      url: url, // Url do lado server que vai receber o arquivo
      data: form_dados,
      processData: false,
      contentType: false,
      type: 'POST',
      beforeSend: function() {
          btn.val( "SENDING..." );
      },
      success: function (data, textStatus, xhr) {
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


var send_form = function(form, event, url){
    event.preventDefault();
    var serializeDados = form.serialize();
    var btn = form.find("input[type='submit']");

    console.log("form: "+form);
    console.log("serializeDados: "+serializeDados);
     
    $.ajax({
        url: url,
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
    $('form[name="wf-form-work-with-us"]').attr('enctype', 'multipart/form-data');
  }

  // news form
  $('form[name="wf-form-newsletter"]').submit(function(event) {
      var form = $(this);
      send_form(form, event, 'http://static.lickslegal.com/mailchimp/index.php');
  });

  // work-with-us form
  $('form[name="wf-form-work-with-us"]').submit(function(event) {
    var form = $(this);
    send_form_file(form, event, 'http://localhost/lickslegal/work-with-us/index.php');
  });

});