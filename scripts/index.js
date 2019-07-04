$(document).ready(() => {

  const SYS = {
    SOURCE: 'source',
    MATRIX: 'matrix',
    OPTIONS: 'options',
    RESULT: 'result',
    OBJECTIVE: 'objective',
    CONSTRAINTS: 'constraints',
    SENSITIVITY: 'sensitivity'
  }

  let state = {
    current: SYS.SOURCE
  }

  function updateLog(content) {
    $('#log').val(`${$('#log').val()}${content}\n`)
  }

  // var editor = CodeMirror.fromTextArea(document.getElementById('textspace'), {
  //   lineNumbers: true,
  //   mode: "htmlmixed"
  // });

  // function updateTextArea() {
  //   myEditor.save();
  // }

  // myEditor.on('change', updateTextArea);

  $('#run').click(() => {

    // If currently on source, first save all current progress.
    if (state.current === SYS.SOURCE) {
      $('#source').val($('#textspace').val())
    }

    var request_data = {
      code: $('#source').val()
    }
    console.log(request_data)

    var url = "http://localhost:5000"
    updateLog('Now Running...')

    fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, cors, *same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow', // manual, *follow, error
      referrer: 'no-referrer', // no-referrer, *client
      body: JSON.stringify(request_data), // body data type must match "Content-Type" header
    }).then(response => {
      return response.json()
    }).then(res => {
      console.log(res)
      if (res.error === '') {
        updateLog('Running Complete.\n')
      } else {
        updateLog(res.error)
      }

      $('#result').val(res.result)
      if (state.current === SYS.RESULT) {
        $('#textspace').val(res.result)
      }
    }).catch(function (e) {
      console.log(e)
      console.log('Error')
    })
  })

  /**
   * Changes the content of the text area into the values associated to the button clicked.
   */
  $('.tab-button').click((e) => {
    const clicked_button = $(e.target)
    var next_tab = clicked_button[0].id

    if (next_tab === 'result') {
      $('#result-dash').show()
    } else {
      $('#result-dash').hide()
    }

    var current_display = $('#textspace').val()
    $(`#${state.current}`).val(current_display)
    state.current = next_tab
    $('#textspace').val($(`#${next_tab}`).val())

    if (next_tab !== SYS.SOURCE) {
      $('#textspace').attr('readonly', true)
    } else {
      $('#textspace').attr('readonly', false)
    }
  })
})
