# Generated by Django 5.0.4 on 2024-05-15 00:39

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('gerenciamento', '0002_rename_postos_coleta_postoscoleta'),
    ]

    operations = [
        migrations.RenameField(
            model_name='residuos',
            old_name='posto_fk',
            new_name='posto_fk_id',
        ),
    ]