

from jinja2 import Environment, FileSystemLoader

env=Environment(
        loader=FileSystemLoader(
            "app/templates"
        )
    )
def render_html(template_name:str,**kwargs):
    template=env.get_template(template_name)
    return template.render(kwargs)
