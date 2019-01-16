from ..models import Post, Category, Tag
from django import template
from django.db.models.aggregates import Count
from django.db import connection

register = template.Library()


@register.simple_tag
# 最新文章模板标签
def get_recent_posts(num=5):
    return Post.objects.all().order_by('-created_time')[:num]


@register.simple_tag
# 归档模板标签
def archives():
    # return Post.objects.dates('created_time', 'month', order='DESC')
    # date_set = set(Post.objects.dates('created_time', 'month', order='DESC'))
    # return Post.objects.extra(select={'day': connection.ops.date_trunc_sql('day', 'created_time')}).values('day').annotate(number=Count('id'))
    # select=str(connection.ops.date_trunc_sql('month', 'created_time') )
    # parm_list=[select,select]
    # return Post.objects.raw('SELECT %s, COUNT(`blog_post`.`id`) AS `number` FROM `blog_post` GROUP BY %s ORDER BY `blog_post`.`created_time` DESC',parm_list)

    cursor = connection.cursor()
    cursor.execute(
        "SELECT A.year,A.month,A.number,concat(A.year,'年归档 (',B.number,')') as year_cnt FROM (SELECT date_format(created_time, '%Y') AS year,date_format(created_time, '%m') AS month,count(*) AS number FROM blog_post GROUP BY year, month ORDER BY created_time DESC) AS A LEFT JOIN (SELECT date_format(created_time, '%Y') AS year, count(*) AS number FROM blog_post GROUP BY year ORDER BY created_time DESC) AS B on A.year=B.year")

    # row = list(cursor.fetchall())

    def dictfetchall(cursor):
        desc = cursor.description
        return [dict(zip([col[0] for col in desc], row)) for row in cursor.fetchall()]

    return dictfetchall(cursor)


# return date_set



@register.simple_tag
# 分类模板标签
def get_categories():
    # 顶部引入 count 函数
    # Count 计算分类下的文章数，其接受的参数为需要计数的模型的名称
    return Category.objects.annotate(num_posts=Count('post')).filter(num_posts__gt=0)


@register.simple_tag
# 云标签模板标签
def get_tags():
    # 顶部引入 count 函数
    # Count 计算分类下的文章数，其接受的参数为需要计数的模型的名称
    return Tag.objects.annotate(num_posts=Count('post')).filter(num_posts__gt=0)


# 自定义filter，过来发表时间，按照年-月-日-时-分截取
@register.filter
def y_m_d_h(value):
    try:
        i = str(value).index("，")
        return str(value)[0:i]
    except:
        return str(value)


@register.filter
def tag_i(value):
    try:
        i = int(value)
        if 0 < i <= 2:
            return 1
        elif 2 < i <= 5:
            return 2
        elif 5 < i <= 10:
            return 3
        else:
            return 4
    except:
        return value


@register.filter
def format_article_index(value):
    try:
        str_value = str(value)
        value_new = str_value.replace(r'ul', r'ul class="article-index" ', 1)
        return value_new
    except:
        return value


@register.filter
def add_css(value='', arg=''):
    """
    :param value: a default string from filter
    :param arg: 'arg1|arg2'
    :return: a srting with replacing arg1 using arg2
    """
    try:
        arg_list = arg.split('|')
        origin_arg = arg_list[0]
        target_arg = arg_list[1]
        value_new = value.replace(origin_arg, target_arg, 1)
        return value_new
    except:
        return value
