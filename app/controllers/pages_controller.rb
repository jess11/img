class PagesController < ApplicationController
  before_action :check_if_logged_in, :only =>[:gallery]

  def index
    @photo = Photo.all
  end

  def photos
    @photos = Photo.all
  end

  def start
    @photo = Photo.new
  end

  def gallery
    @photos = @current_user.photos
  end

end
