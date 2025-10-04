<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BaseController;
use App\Models\ContactMessage;

class AdminContactMessageController extends BaseController
{
    public function index()
    {
        $messages = ContactMessage::orderByDesc('created_at')->paginate(20);

        return $this->renderPage('admin/messages', [
            'messages' => $messages,
        ]);
    }

    public function markAsRead(ContactMessage $message)
    {
        $message->update([
            'is_read' => true,
            'read_at' => now(),
        ]);

        return $this->successResponse('Message marked as read');
    }

    public function markAsUnread(ContactMessage $message)
    {
        $message->update([
            'is_read' => false,
            'read_at' => null,
        ]);

        return $this->successResponse('Message marked as unread');
    }

    public function markAllAsRead()
    {
        ContactMessage::where('is_read', false)->update([
            'is_read' => true,
            'read_at' => now(),
        ]);

        return $this->successResponse('All messages marked as read');
    }

    public function destroy(ContactMessage $message)
    {
        $message->delete();

        return $this->successResponse('Message deleted successfully');
    }
}


