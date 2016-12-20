class @Application
  constructor: ->
    @options =
      animator:
        fixedOnTop:
          selector: '.fixed-on-top'
        fadeIn:
          selector: '.fade-in-on-load'
          wait: 1200
          speed: 1700
        inView:
          selector: '.animate-if-in-view'
          speed:    700
          offsetTop: 100
          css:
            opacity:  0
            position: 'relative'
            top:      '100px'

    @share    = new Share()
    @animator = new Animator(@options.animator)

$(document).ready(->
  window.application = new Application()
)
