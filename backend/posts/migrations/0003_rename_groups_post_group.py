# Generated by Django 5.2.3 on 2025-06-27 11:10

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("posts", "0002_rename_user_post_creator"),
    ]

    operations = [
        migrations.RenameField(
            model_name="post",
            old_name="groups",
            new_name="group",
        ),
    ]
