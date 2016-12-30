load_yaml = require('ewg-config').loadRawYaml

config    = load_yaml 'src/config/technics.yml'

# this helper will be loaded into the haml render context for all projects
module.exports =
  webdesign_technics: ->
    config

  render_webdesign_technics: ->
    result = ''
    for feature, options of config
      image = @image_tag("technics/#{options['image']}.png",
                        {
                          alt:  "familiar with #{options['title']}"
                          title: "familiar with <b>#{options['title']}</b>"
                          'data-tooltip': true
                          class: 'tooltip'
                        })

      result += @link_to(image,
                         options['link'],
                         {
                           target: '_blank'
                           class: "#{options['class']} technic"
                         })

    result
