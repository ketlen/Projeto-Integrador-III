# Generated by Django 5.0.4 on 2024-05-15 00:47

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('gerenciamento', '0003_rename_posto_fk_residuos_posto_fk_id'),
    ]

    operations = [
        migrations.RenameField(
            model_name='residuos',
            old_name='posto_fk_id',
            new_name='posto_fk',
        ),
    ]