from rest_framework import serializers
from .models import Group


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = '__all__'
        read_only_fields = ['id', 'creator', 'created_at']

    def create(self, validated_data):
        user = self.context['request'].user
        return Group.objects.create(creator=user, **validated_data)
