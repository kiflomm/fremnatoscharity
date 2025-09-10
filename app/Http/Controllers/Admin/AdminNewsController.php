<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BaseController;
use App\Http\Requests\Admin\StoreNewsRequest;
use App\Http\Requests\Admin\UpdateNewsRequest;
use App\Models\News;
use App\Models\NewsComment;
use App\Services\NewsService;
use Illuminate\Support\Facades\Auth; 

class AdminNewsController extends BaseController
{
    public function __construct(
        private NewsService $newsService
    ) {}

    public function index()
    {
        $posts = $this->newsService->getAllNews();
        $stats = $this->newsService->getNewsStats();

        return $this->renderPage('admin/news', [
            'posts' => $posts,
            'totalPosts' => $stats['totalPosts'],
        ]);
    }

    public function show(News $news)
    {
        $newsData = $this->newsService->getNewsWithDetails($news);

        return $this->renderPage('admin/news-show', [
            'news' => $newsData,
        ]);
    }

    public function store(StoreNewsRequest $request)
    {
        $this->newsService->createNews($request, Auth::id());

        return $this->successResponse('News created successfully', null, 'admin.news.index');
    }

    public function update(UpdateNewsRequest $request, News $news)
    {
        $this->newsService->updateNews($news, $request);

        return $this->successResponse('News updated successfully');
    }

    public function destroy(News $news)
    {
        $this->newsService->deleteNews($news);

        return $this->successResponse('News deleted successfully');
    }

    public function destroyComment(News $news, NewsComment $comment)
    {
        $deleted = $this->newsService->deleteNewsComment($news, $comment);
        
        if (!$deleted) {
            return $this->errorResponse('Comment not found');
        }

        return $this->successResponse('Comment deleted successfully');
    }

    public function archive(News $news)
    {
        $this->newsService->archiveNews($news);

        return $this->successResponse('News archived successfully');
    }

    public function unarchive(News $news)
    {
        $this->newsService->unarchiveNews($news);

        return $this->successResponse('News unarchived successfully');
    }
}
