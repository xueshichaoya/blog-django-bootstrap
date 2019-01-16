# coding:utf-8

from django.db import models
from django.contrib.auth.models import User
from django.utils.six import python_2_unicode_compatible
from django.urls import reverse
import markdown
from django.utils.html import strip_tags
import django.utils.timezone as time_zone


# from datetime import datetime
# from django.utils.timezone import utc

# Create your models here.

@python_2_unicode_compatible
class Category(models.Model):
    """
    分类模型
    """
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

@python_2_unicode_compatible
class Tag(models.Model):
    """
    标签模型
    """
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

@python_2_unicode_compatible
class Post(models.Model):
    """
    文章模型
    """
    title = models.CharField(max_length=70)
    body = models.TextField()
    created_time = models.DateTimeField(default=time_zone.now)
    modified_time = models.DateTimeField(auto_now=True)
    #excerpt = models.CharField(max_length=600, blank=True)
    excerpt = models.TextField(blank=True)
    #excerpt = models.CharField(max_length=200, blank=True)
    category = models.ForeignKey(Category)
    tags = models.ManyToManyField(Tag, blank=True)
    author = models.ForeignKey(User)
    views = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse('blog:detail', kwargs={'pk': self.pk})

    # Meta类定义默认递减查询
    class Meta:
        ordering = ['-created_time']

    # 定义浏览量自增函数
    def increase_views(self):
        self.views += 1
        self.save(update_fields=['views'])

    def save(self, *args, **kwargs):
        # 如果没填写摘要
        md = markdown.Markdown(extensions=[
            'markdown.extensions.extra',
            'markdown.extensions.codehilite',
            #TocExtension(slugify=slugify),
        ])
        if not self.excerpt:
            self.excerpt = strip_tags(md.convert(self.body))[:140]+'.....'
            #self.excerpt = self.body[:200]
            #self.excerpt = (md.convert(self.body[:200].replace('*','').replace('-',''))).replace('h6','h5').replace('h4','h5').replace('h3','h5').replace('h2','h5').replace('h1','h5')
        else:
            #以html信使存储填写的摘要
            self.excerpt = md.convert(self.excerpt)
        super(Post, self).save(*args, **kwargs)
