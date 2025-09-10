<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BaseController;
use App\Models\ContactMessage;

class AdminContactMessageController extends BaseController
{
    public function index()
    {
        $messages = ContactMessage::orderByDesc('id')->paginate(20);

        return $this->renderPage('admin/messages', [
            'messages' => $messages,
        ]);
    }

    public function destroy(ContactMessage $message)
    {
        $message->delete();

        return $this->successResponse('Message deleted successfully');
    }
}


