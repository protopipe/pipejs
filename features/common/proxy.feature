Feature: Proxy
    In Order to be able to connect my legacy Website to a new Service Landscape without touching old code
    As a (UI and Backend)-Developer
    I want to be able to Proxy (for specific paths) to my old website


    Scenario: Proxy
        Given a legacy website running on Port 3001 always responding with:
        """
        Hello World
        """
        And the pipe is configured to proxy 'http://localhost:3001'
        And the pipe is running
        When I am on '/'
        Then I should see 'Hello World'
