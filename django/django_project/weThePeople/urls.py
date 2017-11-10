from django.conf.urls import url
from . import views

urlpatterns = [
	url(r'^$', views.index, name='index'),
	url(r'^testdb', views.testdb, name='testdb'),
	url(r'^api/v1/get_bills', views.get_bills, name='get_bills'),
	url(r'^api/v1/create_user', views.create_user, name='create_user'),
	url(r'^api/v1/address', views.address, name='address'),
	url(r'^api/v1/get_bill_by_id', views.get_bill_by_id, name='get_bill_by_id'),
	url(r'^api/v1/user_reaction', views.user_reaction, name='user_reaction'),
	url(r'^api/v1/get_newsfeed_bills', views.get_newsfeed_bills, name='get_newsfeed_bills')
]
