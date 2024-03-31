export default function SuccessfullSignUpAlert() {
  return (
    <div className="fixed right-0 flex items-center justify-center w-full top-5">
      <div className="p-4 mx-auto text-green-700 bg-green-100 border-l-4 border-green-500">
        <div className="flex items-center">
          <div className="py-1">
            <svg
              className="w-6 h-6 mr-4 text-green-500 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 9a1 1 0 012 0v4a1 1 0 01-2 0V9zm1-5a1 1 0 100-2 1 1 0 000 2z" />
            </svg>
          </div>
          <div>
            <p className="font-bold">Success</p>
            <p className="text-sm">You have been successfully registered</p>
            <p className="text-sm text-center">Redirecting to login page...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
