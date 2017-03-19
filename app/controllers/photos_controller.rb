class PhotosController < ApplicationController
  def new
  end

  def create
    if @current_user.present?
      @photo = @current_user.photos.new photo_params
      if @photo.save
        render :json => []
      end
    else
      @photo = Photo.new photo_params
      @photo.user_id = nil
      if @photo.save
        render :json => []
      end
    end
  end

  def destroy
    photo = Photo.find(params[:id])
    photo.destroy
    redirect_to :back
  end

  private
  def photo_params
      params.require(:photo).permit(:name, :user_id, :image)
  end
  
end
