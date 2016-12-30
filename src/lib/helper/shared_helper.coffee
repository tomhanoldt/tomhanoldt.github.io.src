fs = require 'fs'

# this helper will be loaded into the haml rer context for all projects
module.exports =
  copyright: (who) ->
    "© #{new Date().getFullYear()} by #{who}"

  social_share_button: (which, attributes={}) ->
    attributes['class'] = '' unless attributes.hasOwnProperty 'class'
    attributes['class'] += " social-button #{which}"

    content = @content_tag 'a', '', class: 'content'
    @content_tag 'div', content, attributes

  social_follow_button: (which, url, attributes={}) ->
    attributes['class'] = '' unless attributes.hasOwnProperty 'class'
    attributes['class'] += " social-button #{which}"

    link = @link_to '&nbsp;', url, class: 'content', target: '_blank'
    content = @content_tag 'div', "#{which.replace('_', ' ')}:", class: 'label'
    content+= @content_tag('div', link, attributes)
    content

  list_partials_for: (relative_view_path) ->
    full_path = "./src/views/#{relative_view_path}"
    partials = []
    files_names = fs.readdirSync(full_path)
    for file_name in files_names
      full_file_path = "#{full_path}/#{file_name}"

      is_dir = fs.statSync(full_file_path).isDirectory()

      file_name_without_extension = file_name.replace('.haml', '')
      partial_path = "#{relative_view_path}/#{file_name_without_extension}"
      partials.push(partial_path) unless is_dir

    partials
