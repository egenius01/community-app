from rest_framework import serializers
from .models import Group
from accounts.serializers import UserSerializer


class GroupSerializer(serializers.ModelSerializer):
    creator = UserSerializer(read_only=True)
    
    class Meta:
        model = Group
        fields = '__all__'
        read_only_fields = ['id', 'creator', 'created_at']

    def create(self, validated_data):
        user = self.context['request'].user
        return Group.objects.create(creator=user, **validated_data)
