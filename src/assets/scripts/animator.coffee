class @Animator
  constructor: (@options)->
    @fixedOnTop = new AnimationFixedOnTop(@options.fixedOnTop)
    @inView     = new AnimationInView    (@options.inView)
    @fadeIn     = new AnimationFadeIn    (@options.fadeIn)


class @AnimationFadeIn
  constructor: (@options)->
    $(@options.selector).animate({opacity: 1}, @options.speed)

class @AnimationInView
  constructor: (@options)->
    @animatedElements = $(@options.selector)
    @setupAnimations()

  setupAnimations: =>
    @animatedElements.css(@options.css)
    $(window).bind('scroll', @chackAnimatedElemets)
    $(window).bind('resize', @chackAnimatedElemets)
    @chackAnimatedElemets()

  chackAnimatedElemets: =>
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
    $(window).bind('scroll', @chackAnimatedElemets)
    $(window).bind('resize', @chackAnimatedElemets)
    @chackAnimatedElemets()

  checkUndoAnimatedElemets: =>
    top = $(window).scrollTop()

    indexToDel = []
    for entry, index in @undoElements
      if top < entry.top
        entry.el.css(entry.css)
        indexToDel.push index

    for index in indexToDel
      @undoElements.slice(index, 1)

  chackAnimatedElemets: =>
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
    )
