from rest_framework import serializers
from .models import Post


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id', 'group', 'creator', 'content', 'created_at']
        read_only_fields = ['id', 'creator', 'created_at']

    def validate_group(self, group):
        user = self.context['request'].user
        if group.creator != user:
            raise serializers.ValidationError("You can only post in groups you created.")
        return group

    def create(self, validated_data):
        return Post.objects.create(
            creator=self.context['request'].user,
            **validated_data
        )
