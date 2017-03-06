class PagesController < ApplicationController
  before_action :check_if_logged_in, :only =>[:gallery, :draw]
  def index
    @photos = Photo.all
  end

  def draw
    @photo = Photo.new
  end

  def gallery
    @photos = @current_user.photos

  end
end
