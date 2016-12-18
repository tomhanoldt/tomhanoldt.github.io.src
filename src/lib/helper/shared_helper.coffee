# this helper will be loaded into the haml rer context for all projects
module.exports =
  copyright: (who) ->
    "© #{new Date().getFullYear()} by #{who}"

  social_share_button: (which, attributes={}) ->
    attributes['class'] = '' unless attributes.hasOwnProperty 'class'
    attributes['class'] += " social-button #{which}"

    content = @content_tag 'a', '', class: 'content'
    @content_tag 'div', content, attributes
