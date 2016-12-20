class @Animator
  constructor: (@options)->
    @fixedOnTop = new AnimationFixedOnTop(@options.fixedOnTop)
    @inView     = new AnimationInView    (@options.inView)
    @fadeIn     = new AnimationFadeIn    (@options.fadeIn)

class @Animation
  constructor: (@options)->
    @animatedElements = []
    # merge data and option values
    for el in $(@options.selector)
      $el = $(el)
      @animatedElements.push $el
      $el.options = $.extend(true, {}, @options)
      for data_key, value of $el.data()
        $el.options[data_key]=value if data_key of @options

class @AnimationFadeIn extends Animation
  constructor: (@options)->
    super @options
    for $el in @animatedElements
      do ($el) ->
        setTimeout(
          ->
            $el.animate({opacity: 1}, $el.options.speed)
          ,
          $el.options.wait
        )


class @AnimationInView
  constructor: (@options)->
    @animatedElements = $(@options.selector)
    @setupAnimations()

  setupAnimations: =>
    @animatedElements.css(@options.css)
    $(window).bind('scroll', @checkAnimatedElemets)
    $(window).bind('resize', @checkAnimatedElemets)
    @checkAnimatedElemets()

  checkAnimatedElemets: =>
    top = $(window).scrollTop() + $(window).height()
    @animatedElements.each((i, el) =>
      $el = $(el)
      if(top + @options.offsetTop > $el.offset().top)
        $el.animate({opacity: 1, top: 0}, @options.speed)
    )

class @AnimationFixedOnTop
  constructor: (@options)->
    @animatedElements = $(@options.selector)
    @undoElements = []
    @setupAnimations()

  setupAnimations: =>
    $(window).bind('scroll', @checkAnimatedElemets)
    $(window).bind('resize', @checkAnimatedElemets)
    @checkAnimatedElemets()

  checkUndoAnimatedElemets: =>
    top = $(window).scrollTop()

    indexToDel = []
    for entry, index in @undoElements
      if top < entry.top
        entry.el.css(entry.css)
        entry.el.removeClass 'fixed'
        indexToDel.push index

    for index in indexToDel
      @undoElements.slice(index, 1)

  checkAnimatedElemets: =>
    @checkUndoAnimatedElemets()

    top = $(window).scrollTop()

    @animatedElements.each((i, el) =>
      $el = $(el)

      return if $el.css('position') == 'fixed'

      offset = $el.offset()
      if(top > offset.top)
        @undoElements.push
          el: $el
          top: offset.top
          css:
            position: $el.css('position')
            left: $el.css('left')

        $el.css
          position: 'fixed'
          top: 0
          left: offset.left

        $el.addClass 'fixed'
    )
