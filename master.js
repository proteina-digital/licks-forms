var send_form = function(form, event, url) {
    event.preventDefault();
    var serializeDados = form.serialize();
    var btn = form.find("input[type='submit']");
    console.log("form: " + form);
    console.log("serializeDados: " + serializeDados);
    $.ajax({
        url: url,
        dataType: 'html',
        type: 'POST',
        data: serializeDados,
        beforeSend: function() {
            btn.val("SENDING...");
        },
        success: function(data, textStatus, xhr) {
            console.log("resposta: " + data);
            console.log("status: " + data.status);
            console.log("xhr: " + xhr.status);
            if (typeof form.attr('redirect') !== 'undefined') {
                window.location = 'http://lickslegal.com/' + form.attr('redirect');
            } else {
                form.parent("div").find('.w-form-done').slideDown();
                form.parent("div").find('.w-form-fail').hide();
                form.hide();
            }
        },
        error: function(xhr, er) {
            console.log('Error ' + xhr.status + ' - ' + xhr.statusText + ' - Tipo de erro: ' + er);
            var erros = [];
            if (xhr.status === 422) {
                erros.push("Seu formulário não foi enviado. Verifique os dados e tente novamente.");
            } else {
                erros.push("Erro no Servidor");
            }
            form.parent("div").find('.w-form-fail').html("<p>" + erros[0] + "</p>");
            form.parent("div").find('.w-form-fail').slideDown();
            btn.val("Subscribe");
        }
    });
}
Webflow.push(function() {
    if (page_is('work-with-us')) {
        $('form[name="wf-form-work-with-us"]').attr('enctype', 'multipart/form-data');

        const work_form = document.querySelector('form[name="wf-form-work-with-us"]');
        const inpFile = document.querySelector('#cv');
        work_form.addEventListener("submit", event => {
            event.preventDefault();
            // const endpoint = 'http://localhost/lickslegal/work-with-us/index.php';
            const endpoint = 'http://static.lickslegal.com/work-with-us/index.php';
            const formData = new FormData();
            formData.append("inpFile", inpFile.files[0]);
            formData.append("name", work_form.querySelector('input[name="name"]').value);
            formData.append("email", work_form.querySelector('input[name="email"]').value);
            formData.append("tel", work_form.querySelector('input[name="tel"]').value);
            formData.append("position", work_form.querySelector('select[name="position"]').value);
            formData.append("message", work_form.querySelector('textarea[name="message"]').value);


            fetch(endpoint, {
                method: 'post',
                body: formData
            }).then(function(response) {
                form = $('form[name="wf-form-work-with-us"]');

                if (response.status >= 200) {
                    return response.text();
                    form.parent("div").find('.w-form-done').slideDown();
                    form.parent("div").find('.w-form-fail').hide();
                    form.hide();
                } else {
                  form.parent("div").find('.w-form-fail').html('Something went wrong...');
                  form.parent("div").find('.w-form-fail').slideDown();
                }
                //throw new Error(response.statusText);
            }).then(function(response) {
                console.log(response);
            }).catch(console.error);
        });
    }
    $('form[name="wf-form-newsletter"]').submit(function(event) {
        var form = $(this);
        send_form(form, event, 'http://static.lickslegal.com/mailchimp/index.php');
    });
    
});